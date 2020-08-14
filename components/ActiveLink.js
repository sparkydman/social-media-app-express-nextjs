import { withRouter } from "next/router";
import Link from "next/link";

const ActiveLink = ({ router, href, children, dynamicLink }) => {
  (function prefetchPages() {
    if (typeof window !== "undefined") {
      router.prefetch(router.pathname);
    }
  })();

  const handleClick = (event) => {
    event.preventDefault();
    router.push(href);
  };

  const isCurrentPath = router.pathname === href || router.asPath === href;

  return (
    <Link href={href} as={dynamicLink}>
      <a
        style={{
          textDecoration: "none",
          margin: 0,
          padding: 0,
          fontWeight: isCurrentPath ? "bold" : "normal",
          color: isCurrentPath ? "#C62828" : "#fff",
        }}
      >
        {children}
      </a>
    </Link>
  );
};

export default withRouter(ActiveLink);
