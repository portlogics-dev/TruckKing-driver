import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function TanstackQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount) => failureCount < 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError: (error: Error, variables: unknown) =>
          console.log({ error, variables }),
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
