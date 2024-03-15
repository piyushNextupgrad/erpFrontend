import { IoIosArrowDropupCircle } from "react-icons/io";
const Scroll = () => {
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  return (
    <>
      <IoIosArrowDropupCircle className="scrollIcon" onClick={scrollToTop} />
    </>
  );
};

export default Scroll;
