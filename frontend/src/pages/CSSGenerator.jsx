import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './CSSGenerator.css';

const DEFAULT_SETTINGS = {
    theme: 'light',
    fontFamily: 'Arial, sans-serif',
    fontSize: 16,
    textAlign: 'left',
    backgroundColor: '#f5f6fa',
    textColor: '#222222',
    navbarColor: '#ffffff',
    cardColor: '#ffffff',
    primaryColor: '#2874f0',
    buttonColor: '#2874f0',
    borderRadius: 10,
    spacing: 20
};


function CSSGenerator() {
    const navigate = useNavigate();

    const [settings, setSettings] = useState(DEFAULT_SETTINGS);

    const [generatedCSS, setGeneratedCSS] = useState('');

    const [copied, setCopied] = useState(false);

    const [applied, setApplied] = useState(
        Boolean(localStorage.getItem('quickkart-custom-css'))
    );


    // Update individual settings
    const updateSetting = (name, value) => {
        setSettings(previous => ({
            ...previous,
            [name]: value
        }));

        setGeneratedCSS('');
        setCopied(false);
    };


    // Light and dark themes
    const applyTheme = (theme) => {

        if (theme === 'dark') {

            setSettings(previous => ({
                ...previous,
                theme: 'dark',
                backgroundColor: '#181a20',
                textColor: '#f5f5f5',
                navbarColor: '#242630',
                cardColor: '#292c36'
            }));

        } else {

            setSettings(previous => ({
                ...previous,
                theme: 'light',
                backgroundColor: '#f5f6fa',
                textColor: '#222222',
                navbarColor: '#ffffff',
                cardColor: '#ffffff'
            }));

        }

        setGeneratedCSS('');
        setCopied(false);
    };


    // Generate CSS for actual QuickKart components
    const generateCSS = () => {

        const css = `/* =========================================
   QUICKKART CUSTOM CSS
   Generated using QuickKart CSS Generator
========================================= */


/* GLOBAL STYLING */

body {
    font-family: ${settings.fontFamily} !important;
    font-size: ${settings.fontSize}px !important;
    background-color: ${settings.backgroundColor} !important;
    color: ${settings.textColor} !important;
    text-align: ${settings.textAlign};
}


/* NAVBAR */

.navbar {
    background-color: ${settings.navbarColor} !important;
    color: ${settings.textColor} !important;
    border-radius: ${settings.borderRadius}px;
}

.logo,
.navbar-right a {
    color: ${settings.primaryColor} !important;
}


/* PRODUCT LISTING */

.home-container,
.product-details-container,
.cart-container {
    background-color: ${settings.backgroundColor} !important;
    color: ${settings.textColor} !important;
}


/* PRODUCT CARDS */

.product-card {
    background-color: ${settings.cardColor} !important;
    color: ${settings.textColor} !important;
    border-radius: ${settings.borderRadius}px !important;
    padding: ${settings.spacing}px !important;
}


/* PRODUCT DETAILS */

.product-details {
    background-color: ${settings.cardColor} !important;
    color: ${settings.textColor} !important;
    border-radius: ${settings.borderRadius}px !important;
    padding: ${settings.spacing}px !important;
}

.details-info h1,
.product-info h3,
.cart-container h1 {
    color: ${settings.textColor} !important;
}

.description,
.category {
    color: ${settings.textColor} !important;
}


/* SHOPPING CART */

.cart-item,
.cart-summary {
    background-color: ${settings.cardColor} !important;
    color: ${settings.textColor} !important;
    border-radius: ${settings.borderRadius}px !important;
    padding: ${settings.spacing}px !important;
}


/* AUTHENTICATION */

.auth-container {
    background-color: ${settings.cardColor} !important;
    color: ${settings.textColor} !important;
    border-radius: ${settings.borderRadius}px !important;
    padding: ${settings.spacing}px !important;
}

.auth-container h1,
.auth-container h2 {
    color: ${settings.textColor} !important;
}


/* INPUTS */

input,
select,
textarea {
    font-family: ${settings.fontFamily} !important;
    font-size: ${settings.fontSize}px !important;
    border-radius: ${settings.borderRadius}px !important;
}


/* BUTTONS */

button,
.details-button,
.pagination button,
.navbar-right button,
.search-container button,
.cart-button,
.auth-container button,
.checkout-button {
    background-color: ${settings.buttonColor} !important;
    color: #ffffff !important;
    border-radius: ${settings.borderRadius}px !important;
}


/* LINKS */

a {
    color: ${settings.primaryColor};
}


/* PRICE AND HIGHLIGHTS */

.price,
.item-subtotal {
    color: ${settings.primaryColor} !important;
}


/* ADMIN DASHBOARD */

.admin-dashboard {
    font-family: ${settings.fontFamily} !important;
}

.analytics-card,
.chart-container,
.visitor-table-container {
    background-color: ${settings.cardColor} !important;
    color: ${settings.textColor} !important;
    border-radius: ${settings.borderRadius}px !important;
}


/* RESPONSIVE DESIGN IS PRESERVED */
`;

        setGeneratedCSS(css);
        setCopied(false);

        return css;
    };


    // Apply CSS dynamically and save permanently in this browser
    const applyToWebsite = () => {

        const css = generateCSS();

        let styleElement = document.getElementById(
            'quickkart-custom-theme'
        );

        if (!styleElement) {

            styleElement = document.createElement('style');

            styleElement.id = 'quickkart-custom-theme';

            document.head.appendChild(styleElement);
        }

        // Apply styling immediately
        styleElement.textContent = css;

        // Save styling in localStorage
        localStorage.setItem(
            'quickkart-custom-css',
            css
        );

        setApplied(true);

        alert(
            'Your custom styling has been saved and applied across QuickKart!'
        );
    };


    // Copy generated CSS
    const copyCSS = async () => {

        const css = generatedCSS || generateCSS();

        try {

            await navigator.clipboard.writeText(css);

            setCopied(true);

        } catch (error) {

            alert(
                'Unable to copy CSS. Please copy it manually.'
            );

        }
    };


    // Download generated CSS
    const downloadCSS = () => {

        const css = generatedCSS || generateCSS();

        const blob = new Blob(
            [css],
            { type: 'text/css' }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;

        link.download = 'quickkart-custom.css';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };


    // Reset styling
    const resetSettings = () => {

        setSettings(DEFAULT_SETTINGS);

        setGeneratedCSS('');

        setCopied(false);

        setApplied(false);

        // Remove saved styling
        localStorage.removeItem('quickkart-custom-css');

        // Remove currently applied styling
        const styleElement = document.getElementById(
            'quickkart-custom-theme'
        );

        if (styleElement) {
            styleElement.remove();
        }

        alert('QuickKart styling has been reset.');
    };


    return (

        <div className="css-generator-page">

            {/* HEADER */}

            <div className="css-generator-header">

                <div>
                    <h1>QuickKart CSS Generator</h1>

                    <p>
                        Customize the appearance of your entire website.
                    </p>
                </div>

                <button
                    className="back-dashboard-button"
                    onClick={() => navigate('/admin-dashboard')}
                >
                    ← Back to Dashboard
                </button>

            </div>


            <div className="css-generator-layout">


                {/* CUSTOMIZATION PANEL */}

                <div className="css-controls">

                    <h2>Website Customization</h2>


                    {/* THEME */}

                    <div className="control-group">

                        <label>Website Theme</label>

                        <div className="theme-buttons">

                            <button
                                className={
                                    settings.theme === 'light'
                                        ? 'active'
                                        : ''
                                }
                                onClick={() => applyTheme('light')}
                            >
                                ☀ Light
                            </button>

                            <button
                                className={
                                    settings.theme === 'dark'
                                        ? 'active'
                                        : ''
                                }
                                onClick={() => applyTheme('dark')}
                            >
                                🌙 Dark
                            </button>

                        </div>

                    </div>


                    {/* FONT */}

                    <div className="control-group">

                        <label>Font Family</label>

                        <select
                            value={settings.fontFamily}
                            onChange={e =>
                                updateSetting(
                                    'fontFamily',
                                    e.target.value
                                )
                            }
                        >
                            <option value="Arial, sans-serif">
                                Arial
                            </option>

                            <option value="Verdana, sans-serif">
                                Verdana
                            </option>

                            <option value="Georgia, serif">
                                Georgia
                            </option>

                            <option value="'Times New Roman', serif">
                                Times New Roman
                            </option>

                            <option value="'Courier New', monospace">
                                Courier New
                            </option>

                            <option value="Tahoma, sans-serif">
                                Tahoma
                            </option>

                        </select>

                    </div>


                    {/* FONT SIZE */}

                    <div className="control-group">

                        <label>
                            Font Size: {settings.fontSize}px
                        </label>

                        <input
                            type="range"
                            min="12"
                            max="32"
                            value={settings.fontSize}
                            onChange={e =>
                                updateSetting(
                                    'fontSize',
                                    Number(e.target.value)
                                )
                            }
                        />

                    </div>


                    {/* ALIGNMENT */}

                    <div className="control-group">

                        <label>Text Alignment</label>

                        <select
                            value={settings.textAlign}
                            onChange={e =>
                                updateSetting(
                                    'textAlign',
                                    e.target.value
                                )
                            }
                        >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                            <option value="justify">Justify</option>
                        </select>

                    </div>


                    {/* COLORS */}

                    {[
                        ['backgroundColor', 'Website Background'],
                        ['textColor', 'Text Colour'],
                        ['navbarColor', 'Navbar Colour'],
                        ['cardColor', 'Product Card Colour'],
                        ['primaryColor', 'Primary Colour'],
                        ['buttonColor', 'Button Colour']
                    ].map(([name, label]) => (

                        <div className="control-group" key={name}>

                            <label>{label}</label>

                            <input
                                type="color"
                                value={settings[name]}
                                onChange={e =>
                                    updateSetting(name, e.target.value)
                                }
                            />

                        </div>

                    ))}


                    {/* BORDER RADIUS */}

                    <div className="control-group">

                        <label>
                            Border Radius: {settings.borderRadius}px
                        </label>

                        <input
                            type="range"
                            min="0"
                            max="30"
                            value={settings.borderRadius}
                            onChange={e =>
                                updateSetting(
                                    'borderRadius',
                                    Number(e.target.value)
                                )
                            }
                        />

                    </div>


                    {/* SPACING */}

                    <div className="control-group">

                        <label>
                            Spacing: {settings.spacing}px
                        </label>

                        <input
                            type="range"
                            min="5"
                            max="50"
                            value={settings.spacing}
                            onChange={e =>
                                updateSetting(
                                    'spacing',
                                    Number(e.target.value)
                                )
                            }
                        />

                    </div>


                    {/* ACTION BUTTONS */}

                    <button
                        className="generate-css-button"
                        onClick={generateCSS}
                    >
                        Generate CSS
                    </button>

                    <button
                        className="apply-css-button"
                        onClick={applyToWebsite}
                    >
                        Apply to Website
                    </button>

                    <button
                        className="reset-css-button"
                        onClick={resetSettings}
                    >
                        Reset Styling
                    </button>

                </div>


                {/* PREVIEW PANEL */}

                <div className="css-preview-section">

                    <h2>Live Preview</h2>

                    <div
                        className="css-live-preview"
                        style={{
                            backgroundColor: settings.backgroundColor,
                            color: settings.textColor,
                            fontFamily: settings.fontFamily,
                            fontSize: `${settings.fontSize}px`,
                            textAlign: settings.textAlign,
                            padding: `${settings.spacing}px`,
                            borderRadius: `${settings.borderRadius}px`
                        }}
                    >

                        <h2>Welcome to QuickKart</h2>

                        <p>
                            This is a live preview of your customized website.
                        </p>

                        <div
                            className="preview-product-card"
                            style={{
                                backgroundColor: settings.cardColor,
                                borderRadius: `${settings.borderRadius}px`
                            }}
                        >

                            <h3>Sample Product</h3>

                            <p>
                                Experience your customized design.
                            </p>

                            <button
                                style={{
                                    backgroundColor: settings.buttonColor,
                                    borderRadius: `${settings.borderRadius}px`
                                }}
                            >
                                Add to Cart
                            </button>

                        </div>

                    </div>


                    {/* APPLICATION STATUS */}

                    {applied && (

                        <div className="css-applied-message">

                            ✓ Custom styling is saved and active across
                            QuickKart.

                        </div>

                    )}


                    {/* GENERATED CSS */}

                    <div className="generated-css-section">

                        <h2>Generated CSS Code</h2>

                        <p>
                            Generate, copy or download your customized
                            QuickKart stylesheet.
                        </p>

                        <textarea
                            className="generated-css-output"
                            value={generatedCSS}
                            readOnly
                            placeholder="Click Generate CSS to see your stylesheet..."
                        />


                        <div className="css-output-actions">

                            <button
                                onClick={copyCSS}
                                disabled={!generatedCSS}
                            >
                                {copied ? '✓ Copied' : 'Copy CSS'}
                            </button>

                            <button
                                onClick={downloadCSS}
                                disabled={!generatedCSS}
                            >
                                Download CSS
                            </button>

                        </div>


                        <div className="css-instructions">

                            <h3>How to use generated CSS</h3>

                            <ol>
                                <li>Customize your website appearance.</li>
                                <li>Click Generate CSS.</li>
                                <li>Click Apply to Website for immediate changes.</li>
                                <li>Use Copy CSS or Download CSS to save the code.</li>
                            </ol>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default CSSGenerator;