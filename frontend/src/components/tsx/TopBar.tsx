import {
    faCaretDown,
    faCircleChevronLeft,
    faMagnifyingGlass,
    faUser
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import { useSearchTracksContext } from '../../context/SearchTracksContextProvider';
import { useTracksContext } from '../../context/TracksContextProvider';
import useAuth from '../../hooks/useAuth';
import '../css/topbar.css';
const SEARCH_URL = '/track/search/?title=';
const SEARCH_ARTIST_URL = '/artist/search/?name=';

const TopBar = () => {
    const { auth } = useAuth();
    const firstName = auth?.user?.firstName;
    const lastName = auth?.user?.lastName;
    const [title, setTitle] = useState('');
    const {
        tracksContextState: { tracks }
    } = useTracksContext();

    const { updateSearchTracksContextState } = useSearchTracksContext();

    useEffect(() => {
        const listTrack: any[] = [];
        if (title !== '') {
            axios
                .get(`${SEARCH_URL}${title}`, { withCredentials: true })
                .then((response) => {
                    const tracks = response?.data?.tracks;
                    for (const track of tracks) {
                        listTrack.push(track);
                    }
                });
            axios
                .get(`${SEARCH_ARTIST_URL}${title}`, { withCredentials: true })
                .then((response) => {
                    const users = response?.data?.users;
                    for (const user of users) {
                        for (const trackInTracks in user.tracks) {
                            const trackIndex = tracks.findIndex(
                                (track: any) =>
                                    track._id === user.tracks[trackInTracks]
                            );
                            listTrack.push(tracks[trackIndex]);
                        }
                    }
                });
        }
        updateSearchTracksContextState({ searchTracks: listTrack });
    }, [title]);

    const location = useLocation().pathname;
    const isActive = location === '/search';

    const searchFormShow = isActive
        ? 'search-container-active'
        : 'search-container-hidden';

    return (
        <div className="topbar-wrapper">
            <div className="topbar-container d-flex flex-row align-items-center">
                <div className="btn-container ms-3">
                    <button className="back-btn" title="Quay lại">
                        <FontAwesomeIcon
                            icon={faCircleChevronLeft}
                            color="white"
                            size="2x"
                            className="account-icon rounded"
                        />
                    </button>
                </div>
                <div className={searchFormShow}>
                    <form
                        className="search-form d-flex form-control rounded-5 align-items-center border-dark"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            color="black"
                            className="search-icon rounded ms-1 me-2 border-dark"
                        />
                        <input
                            type="search"
                            className="search-input border-0"
                            placeholder="Bạn muốn nghe gì?"
                            aria-invalid="false"
                            autoCapitalize="off"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </form>
                </div>
                <div className="topbar-account d-flex align-items-center">
                    <button className="account-btn d-flex flex-row rounded-4">
                        <div className="icon-container d-flex align-items-center justify-content-center">
                            <FontAwesomeIcon
                                icon={faUser}
                                color="white"
                                className="account-icon rounded"
                            />
                        </div>
                        <span className="name text-white ms-2 me-3">
                            {firstName + ' ' + lastName}
                        </span>
                        <div className="caret-down-container align-items-center float-end">
                            <FontAwesomeIcon
                                icon={faCaretDown}
                                color="white"
                                className="account-icon rounded"
                            />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
