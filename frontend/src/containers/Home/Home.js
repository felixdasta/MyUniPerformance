import React from "react";
import './Home.scss'

export default function Home() {

    return (
        <div>
            <h1 className="center-horizontally">What is MyUniPerformance about?</h1>
            <div className="video-responsive">
                <iframe
                    src={`https://www.youtube.com/embed/ii8QUuAyOAI`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="MyUniPerformance Demo"
                />
            </div>
        </div>

    );
}
