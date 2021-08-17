import Main from "./Main";
import Layout from "../components/Layout";
import UrlInput from "../components/UrlInput";

import useUrl from "../hooks/useUrl";

export default function IndexPage() {
  const [url] = useUrl();
  return (
    <Layout>
      <UrlInput />
      {url && <Main url={url} />}
    </Layout>
  );
}
