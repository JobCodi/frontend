#!/usr/bin/env bash
# PreToolUse(Bash) 훅: 파괴적 삭제와 시크릿 파일 노출 명령을 차단한다.
# exit 2 => 명령 차단 후 stderr 메시지를 에이전트에 전달.
set -euo pipefail

input=$(cat)

cmd=$(printf '%s' "$input" | node -e '
let d="";
process.stdin.on("data", c => d += c);
process.stdin.on("end", () => {
  try { process.stdout.write(JSON.parse(d).tool_input?.command || ""); }
  catch { process.stdout.write(""); }
});
' 2>/dev/null || true)

[ -z "$cmd" ] && exit 0

block() {
  echo "🚫 차단됨: $1" >&2
  echo "이 명령은 안전 훅(block-secrets.sh)에 의해 막혔습니다. 의도한 작업이면 사람이 직접 실행하세요." >&2
  exit 2
}

# 1) 루트/홈 대상 파괴적 삭제 (short/long 옵션 모두)
if printf '%s' "$cmd" | grep -Eq 'rm[[:space:]]+((-[a-zA-Z]+|--(recursive|force|no-preserve-root))[[:space:]]+)*(-[a-zA-Z]*[rRfF][a-zA-Z]*|--(recursive|force))[[:space:]]+(/|~|\$HOME|/\*|\.\*)([[:space:]]|$)'; then
  block "루트/홈 대상 파괴적 삭제(rm -rf)"
fi

# 2) .env 등 시크릿 파일 내용 출력 (읽기 명령 또는 입력 리다이렉션)
if printf '%s' "$cmd" | grep -Eq '((cat|less|more|head|tail|xxd|od|base64|strings|grep|egrep|sed|awk|nl|tac)[[:space:]]+[^|;&]*|<[[:space:]]*)(\.env($|[^.a-zA-Z0-9])|\.env\.[a-z]+|id_rsa|id_ed25519|\.pem($|[^a-zA-Z]))'; then
  block "시크릿/자격증명 파일 내용 출력 시도"
fi

# 3) .env를 git에 강제 추가
if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+add[[:space:]]+[^|;&]*(-f|--force)[^|;&]*\.env'; then
  block ".env 파일 강제 git add"
fi

# 4) 원격으로 시크릿 유출 (curl/wget에 .env 첨부)
if printf '%s' "$cmd" | grep -Eq '(curl|wget)[[:space:]]+[^|;&]*\.env'; then
  block ".env 파일을 원격으로 전송 시도"
fi

exit 0
