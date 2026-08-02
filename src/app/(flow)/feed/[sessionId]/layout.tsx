/**
 * Parallel-route layout for the feed segment: `children` is the feed list
 * (or the full-page job detail when navigated directly), `modal` is the
 * @modal slot that the (.)[itemId] intercepting route fills in.
 */
export default function FeedLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
