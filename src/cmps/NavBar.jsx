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
    const loggedinUser = userService.getLoggedinUser();
    const location = useLocation();

    useEffect(() => {
        const navBar = document.querySelector(".nav-bar");
        navBar.style.opacity = location.pathname.includes('/signup') ? '0' : '1';
    }, [location.pathname]);

    function isLinkActive(path) {
        return location.pathname === path;
    }

    function onAddPost() {
        setIsModalOpen(true);
    }

    function onCloseModal() {
        setIsModalOpen(false);
    }

    // ... (le reste de votre code)



    return (

        <section className="nav-bar" >
            <div className="narrow-top-bar"></div>
            <div className="insta-icon">
                <InstagramLogo margin="1.5em" marginTop="40px" />
            </div>
            <div className="vista-logo">
                <InstagramLogo margin="1.5em" marginTop="40px" />
            </div>


            <ul className="nav-list">
                <li className="nav-item home">
                    <Link to="/" className="nav-link" style={{ fontWeight: isLinkActive('/') ? 600 : 'normal' }}>
                        <HomeIcon marginRight="1em" active={isLinkActive('/')} />
                        <span className='nav-name'>Home</span>

                    </Link>
                </li>
                <li className="nav-item search">
                    <Link to="/search" className="nav-link" style={{ fontWeight: isLinkActive('/search') ? 600 : 'normal' }}>
                        <SearchIcon marginRight="1em" active={isLinkActive('/search')} />
                        <span className='nav-name'>Search</span>

                    </Link>
                </li>
                <li className="nav-item explore">
                    <Link to="/explore" className="nav-link" style={{ fontWeight: isLinkActive('/explore') ? 600 : 'normal' }}>
                        <ExploreIcon marginRight="1em" active={isLinkActive('/explore')} />
                        <span className='nav-name'>Explore</span>

                    </Link>
                </li>
                <li className="nav-item reels">
                    <Link to="/reels" className="nav-link" style={{ fontWeight: isLinkActive('/reels') ? 600 : 'normal' }}>
                        <ReelsIcon marginRight="1em" active={isLinkActive('/reels')} />
                        <span className='nav-name'>Reels</span>

                    </Link>
                </li>
                <li className="nav-item chat">
                    <Link to="/chat" className="nav-link" style={{ fontWeight: isLinkActive('/chat') ? 600 : 'normal' }}>
                        <MessagesIcon marginRight="1em" active={isLinkActive('/chat')} />
                        <span className='nav-name'>Messages</span>

                    </Link>
                </li>
                <li className="nav-item notifications">
                    <Link to="/notifications" className="nav-link" style={{ fontWeight: isLinkActive('/notifications') ? 600 : 'normal' }}>
                        <NotificationsIcon marginRight="1em" active={isLinkActive('/notifications')} />
                        <span className='nav-name'>Notifications</span>
                    </Link>
                </li>
                <li onClick={onAddPost} className="nav-item create">
                    <Link className="nav-link">
                        <CreateIcon marginRight="1em" />
                        <span className='nav-name'>Create</span>

                    </Link>
                </li>
                <li className="nav-item userDetails">
                    <Link to="/user" className="nav-link">
                         {/* <i className="fa-regular fa-circle"></i>  */}
                       {loggedinUser ? <img src={loggedinUser.imgUrl} className="user-avatar nav-img" /> : 
                        <img src= 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png' className="user-avatar nav-img" />}
                        <span className='nav-name'>Profile</span>
                    </Link>
                </li>
                <li className="nav-item hamburger-menu">
                    <Link to="/" className="nav-link">
                        <MoreIcon marginRight="1em" />
                        <span className='nav-name'>More</span>

                    </Link>
                </li>
            </ul>
            {isModalOpen && <AddPost setIsModalOpen={setIsModalOpen} onCloseModal={onCloseModal} />}
        </section>
    );
}