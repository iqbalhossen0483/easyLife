import Footer from "./footer/Footer";
import Header from "./header/Header";

export function Common({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
