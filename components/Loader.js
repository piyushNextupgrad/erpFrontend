import Spinner from "react-bootstrap/Spinner";
import { useSelector, useDispatch } from "react-redux";
import { change } from "../store/slice";
import { useEffect } from "react";
const Loader = () => {
  const loader = useSelector((state) => state.changeReducer.value);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log("loader", loader);
  // }, [loader]);
  return (
    <>
      {loader == true ? (
        <div className="loader">
          <Spinner animation="border" role="status" variant="info"></Spinner>
        </div>
      ) : null}
    </>
  );
};

export default Loader;
