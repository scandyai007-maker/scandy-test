import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Games from './pages/Games';
import News from './pages/News';
import Collections from './pages/Collections';
import GameDetail from './pages/GameDetail';
import NewsDetail from './pages/NewsDetail';
import CollectionDetail from './pages/CollectionDetail';
import TagDetail from './pages/TagDetail';
import AdminApp from './admin/AdminApp';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="games" element={<Games />} />
          <Route path="games/:slug" element={<GameDetail />} />
          <Route path="news" element={<News />} />
          <Route path="news/:slug" element={<NewsDetail />} />
          <Route path="collections" element={<Collections />} />
          <Route path="collections/:slug" element={<CollectionDetail />} />
          <Route path="tags/:name" element={<TagDetail />} />
        </Route>

        {/* Refine Admin CMS Route */}
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </Router>
  );
}
