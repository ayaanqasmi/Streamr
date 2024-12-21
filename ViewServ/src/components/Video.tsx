import React from 'react';
import VideoSingleCard from './VideoSingleCard';
import { VideoI } from '../types/Video';

const Video = ({ videos, className }) => {

    return (
        <section id='video' className={className}>
            <div className="my-container">
                <div className='row'>
                    {videos?.map((item: any, idx: number) => (
                        item.id && <VideoSingleCard key={idx} video={item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Video;
