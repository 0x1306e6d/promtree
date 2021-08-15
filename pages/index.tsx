import Layout from "../components/Layout";
import MetricTable from "../components/MetricTable";
import UrlInput from "../components/UrlInput";

import useUrl from "../hooks/useUrl";

export default function IndexPage() {
  const [url] = useUrl();
  return (
    <Layout>
      <UrlInput />
      {url && <MetricTable url={url} />}
    </Layout>
  );
}
