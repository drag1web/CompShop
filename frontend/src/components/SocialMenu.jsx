import React from "react";
import "./SocialMenu.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTelegram,
    faVk,
    faInstagram,
} from "@fortawesome/free-brands-svg-icons";

function SocialMenu() {
    return (
        <nav className="social-menu">
            <a
            href="https://t.me/"
            className="social-button telegram"
            target="_blank"
            rel="noopener noreferrer"
            >
                <FontAwesomeIcon icon={faTelegram} size="lg"/> 
            </a>
            <a
            href="https://vk.com/"
            className="social-button vk"
            target="_blank"
            rel="noopener noreferrer"
            >
                <FontAwesomeIcon icon={faVk} size="lg" />
            </a>
            <a
            href="https://instagram.com/"
            className="social-button instagram"
            target="_blank"
            rel="noopener noreferrer"
            >
                <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
        </nav>
    );
}

export default SocialMenu;