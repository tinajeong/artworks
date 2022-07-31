import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Artwork from "./component/Artwork";
import FetchingError from "./component/FetchingError";
import NavigationBar from "./component/NavigationBar";
import SimpleArtwork from "./component/SimpleArtwork";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <NavigationBar />
          <Routes>
            <Route path="/" element={<Artwork />}></Route>
            <Route path="/artworks" element={<SimpleArtwork />}></Route>
            <Route path="*" element={<FetchingError />}></Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
