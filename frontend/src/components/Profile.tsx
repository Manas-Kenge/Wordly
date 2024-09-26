import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from './Avatar';
import { useClickAway } from '../hooks/useClickAway';

export const Profile = () => {

    const ref = useRef<HTMLDivElement>(null);

    const userJSON = localStorage.getItem('user') || '{}';
    const user = JSON.parse(userJSON);

    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    // const { currentUser } = useUser(user.id);

    const logout = () => {
        localStorage.clear();
        navigate('/');
    };

    const goToProfile = () => {
        console.log(user);
        if (user && user.id) {
            navigate(`/profile/${user.id}`);
        }
    };

    const handleClickAway = () => {
        setShow(false);
    };

    useClickAway(ref, handleClickAway);

    return <div>                                                    
        <div className="relative cursor-pointer">
            <Avatar name={user.authorName} onClick={() => setShow(!show)} />
            {/* imageSrc={currentUser?.profilePic} */}
            {show && (
                <div
                    ref={ref}
                    className="absolute -bottom-24 -left-36 shadow-lg bg-main border rounded-md border-gray-100 z-50 w-[160px]"
                >
                    <div className="flex flex-col">
                        <div className="px-4 py-2 hover:bg-sub" onClick={goToProfile}>
                            Profile
                        </div>
                        <div className="px-4 py-2 hover:bg-sub" onClick={logout}>
                            Logout
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
}

