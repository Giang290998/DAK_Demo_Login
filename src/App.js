import { memo } from 'react';
import './App.scss';
import LoginRegister from './pages/login_register/LoginRegister';

function App() {

    return (
        <div className={"app"}>
            <LoginRegister />
        </div>
    );
}

export default memo(App);
