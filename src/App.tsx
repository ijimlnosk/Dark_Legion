import AppRouter from "./app/router";
import QueryProvider from "./app/providers/query";

const App = () => {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
};

export default App;
