import "@/styles/globals.css";
import Layout from "@/components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "../store/store";
import { Provider } from "react-redux";
import Loader from "@/components/Loader";
import Scroll from "@/components/scrollTotop";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Provider store={store}>
        <Loader />
        <Component {...pageProps} />
        <Scroll />
      </Provider>
    </Layout>
  );
}
