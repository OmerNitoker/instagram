import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { AddPost } from './AddPost';
import { SearchIcon } from './icons-cmps/SearchIcon';
import { ExploreIcon } from './icons-cmps/ExploreIcon';
import { ReelsIcon } from './icons-cmps/ReelsIcon';
import { MessagesIcon } from './icons-cmps/MessagesIcon';
import { NotificationsIcon } from './icons-cmps/NotificationsIcon';
import { CreateIcon } from './icons-cmps/CreateIcon';
import { MoreIcon } from './icons-cmps/MoreIcon';
import { HomeIcon } from './icons-cmps/HomeIcon';
import { InstagramLogo } from './icons-cmps/InstagramLogo';
import { userService } from '../services/user.service';

export function NavBar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const loggedinUser = userService.getLoggedinUser();
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function isLinkActive(path) {
        return location.pathname === path;
    }

    function onAddPost() {
        setIsModalOpen(true);
    }

    function onCloseModal() {
        setIsModalOpen(false);
    }

    return (
        <section className={`nav-bar ${isMobile ? 'mobile' : ''}`}>
            <InstagramLogo margin="1em" marginTop="35px" />

            <ul className="nav-list">
                {isMobile ? (
                    <>
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                <HomeIcon />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/search" className="nav-link">
                                <SearchIcon />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/explore" className="nav-link">
                                <ExploreIcon />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/reels" className="nav-link">
                                <ReelsIcon />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/user" className="nav-link">
                                <img src={loggedinUser.imgUrl} className="user-avatar nav-img" />
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="nav-item home">
                            <Link to="/" className="nav-link" style={{ fontWeight: isLinkActive('/') ? 600 : 'normal' }}>
                                <HomeIcon marginRight="1em" active={isLinkActive('/')} />
                                Home
                            </Link>
                        </li>
                        <li className="nav-item search">
                            <Link to="/search" className="nav-link" style={{ fontWeight: isLinkActive('/search') ? 600 : 'normal' }}>
                                <SearchIcon marginRight="1em" active={isLinkActive('/search')} />
                                Search
                            </Link>
                        </li>
                        <li className="nav-item explore">
                            <Link to="/explore" className="nav-link" style={{ fontWeight: isLinkActive('/explore') ? 600 : 'normal' }}>
                                <ExploreIcon marginRight="1em" active={isLinkActive('/explore')} />
                                Explore
                            </Link>
                        </li>
                        <li className="nav-item reels">
                            <Link to="/reels" className="nav-link" style={{ fontWeight: isLinkActive('/reels') ? 600 : 'normal' }}>
                                <ReelsIcon marginRight="1em" active={isLinkActive('/reels')} />
                                Reels
                            </Link>
                        </li>
                        <li className="nav-item chat">
                            <Link to="/chat" className="nav-link" style={{ fontWeight: isLinkActive('/chat') ? 600 : 'normal' }}>
                                <MessagesIcon marginRight="1em" active={isLinkActive('/chat')} />
                                Messages
                            </Link>
                        </li>
                        <li className="nav-item notifications">
                            <Link to="/notifications" className="nav-link" style={{ fontWeight: isLinkActive('/notifications') ? 600 : 'normal' }}>
                                <NotificationsIcon marginRight="1em" active={isLinkActive('/notifications')} />
                                Notifications
                            </Link>
                        </li>
                        <li onClick={onAddPost} className="nav-item create">
                            <Link className="nav-link">
                                <CreateIcon marginRight="1em" />
                                Create
                            </Link>
                        </li>
                        <li className="nav-item userDetails">
                            <Link to="/user" className="nav-link">
                                <img src={loggedinUser.imgUrl} className="user-avatar nav-img" />
                                Profile
                            </Link>
                        </li>
                        <li className="nav-item hamburger-menu">
                            <Link to="/" className="nav-link">
                                <MoreIcon marginRight="1em" />
                                More
                            </Link>
                        </li>
                    </>
                )}
            </ul>
            {isModalOpen && <AddPost setIsModalOpen={setIsModalOpen} onCloseModal={onCloseModal} />}
        </section>
    );
}
