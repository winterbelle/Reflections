import './Header.css'
import reflectionsLogo from '../assets/Reflections-Logo.png'
import chatIcon from '../assets/chat_bubble.png'
import notificationsIcon from '../assets/notification_bell.png'
import profileIcon from '../assets/Default-Profile-Female.png'
function Header() {
    return (
        <header className="header-container">
            <div id="left-header">
                <img src={reflectionsLogo} className='reflections-logo' alt='Reflections logo'></img>
                <input type="text" name='search_input' placeholder='Search...' className='search-bar'></input>
            </div>

            <div id="center-header">
                <a href='#' className='header-link'>Home</a>
                <a href='#' className='header-link'>Communities</a>
                <a href='#' className='header-link'>My Space</a>
                <a href='#' className='header-link'>Whispers</a>
                <a href='#' className='header-link'>Resources</a>
            </div>

            <div id="right-header">

                <p>+ Share</p>

                <a href='#' className='image-link'>
                    <img src={chatIcon} alt='Chat Icon'></img>
                </a>

                <a href='#' className='image-link'>
                    <img src={notificationsIcon} alt='Notifications Icon'></img>
                </a>

                <a href='#' className='image-link'>
                    <img src={profileIcon} id='profile-icon' alt='Default Profile Icon'></img>
                </a>
            </div>
        </header>
    )
}

export default Header