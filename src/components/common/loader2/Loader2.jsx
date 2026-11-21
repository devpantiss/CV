import BrandLogo from '../../ui/BrandLogo';
import './loader2.css';

const Loader2 = () => {
    return (
        <div className="overlay" role="status" aria-label="Loading Career Valley">
            <div id="page">
                <div id="container">
                    <div id="ring"></div>
                    <div id="ring"></div>
                    <div id="ring"></div>
                    <div id="ring"></div>
                    <div id="h3">
                        <BrandLogo className="w-32" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loader2;
