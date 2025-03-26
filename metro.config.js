import { makeMetroConfig } from "@rnx-kit/metro-config";
import MetroSymlinksResolver from "@rnx-kit/metro-resolver-symlinks";

export default makeMetroConfig({
  projectRoot: __dirname,
  resolver: {
    resolveRequest: MetroSymlinksResolver(),
  },
});
