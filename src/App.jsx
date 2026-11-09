import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from './components/Header.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Footer from './components/Footer.jsx';
import Loading from './components/Loading.jsx';

import './App.css';

const Home = lazy(() => import('./pages/Home.jsx'));
const Search = lazy(() => import('./pages/Search.jsx'));
const MediaList = lazy(() => import('./pages/MediaList.jsx'));
const MovieDetails = lazy(() => import('./pages/MovieDetails.jsx'));
const SerieDetails = lazy(() => import('./pages/SerieDetails.jsx'));
const PersonDetails = lazy(() => import('./pages/PersonDetails.jsx'));
const Page404 = lazy(() => import('./pages/Page404.jsx'));

const PERSONAS = [
    { path: '/people', key: 'people' },
    { path: '/person', key: 'person' },
    { path: '/persons', key: 'persons' },
];

function App() {
    return (
        <>
            <ScrollToTop />
            <Header />

            <div className='app' id='contenido'>
                <Suspense fallback={<Loading />}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/search' element={<Search />} />

                        <Route
                            path='/movies'
                            element={<MediaList key='movies' type='movie' />}
                        />
                        <Route path='/movies/:id' element={<MovieDetails />} />

                        <Route
                            path='/series'
                            element={<MediaList key='series' type='tv' />}
                        />
                        <Route path='/series/:id' element={<SerieDetails />} />

                        {PERSONAS.map(({ path, key }) => (
                            <Route
                                key={key}
                                path={path}
                                element={<MediaList key={key} type='person' />}
                            />
                        ))}
                        {PERSONAS.map(({ path, key }) => (
                            <Route key={`${key}-detalle`} path={`${path}/:id`} element={<PersonDetails />} />
                        ))}

                        <Route path='*' element={<Page404 />} />
                    </Routes>
                </Suspense>
            </div>

            <Footer />
        </>
    );
}

export default App;
