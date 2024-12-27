"use client"
import Video from '@/components/Video';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

const Page: React.FC = () => {
    const [vidsrc, setVidSrc] = useState("loading.mp4"); // Video source URL
    const [loadingVideo, setLoadingVideo] = useState(true); // Loading state for the video
    const [videos, setVideos] = useState([]);
    const [vidDetails, setVidDetails] = useState({})
    const params = useParams();
    const getById = params.slug[1];
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const data = await FetchApi(`search?part=snippet&q=${selectedCategory}`);
                const data = await fetch("http://localhost:8080/api/storage/get-random")
                const vids = await data.json()
                console.log(vids);
                setVideos(vids.filter(vid => {
                    return vid.id != getById
                }));
                const currentVideo = vids.find(vid => {
                    return vid.id == getById;
                })
                setVidDetails(currentVideo)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/storage/get/${getById}`, {
                    method: 'GET'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch video');
                }

                const vidblob = await response.blob();
                const videoObjectUrl = URL.createObjectURL(vidblob);
                setVidSrc(videoObjectUrl);
            } catch (error) {
                console.error("Error fetching video:", error);
            } finally {
                setLoadingVideo(false);
            }
        };

        fetchData();
    }, [getById]);

    return (
        <>
            <section id="slug">
                <div className='my-container'>
                    <div className="row">
                        <div className="left">
                            {loadingVideo ? (
                                <div>
                                    <ReactPlayer playing={true} loop={true} muted={true} className="player" url={vidsrc} fallback={<div>Video is loading...</div>} />
                                </div>
                            ) : vidsrc ? (
                                <>
                                    <ReactPlayer controls className="player" url={vidsrc} fallback={<div>Video is loading...</div>} />

                                </>

                            ) : (
                                <p>Video not available</p>
                            )}
                            <h6>{vidDetails?.title}</h6>
                            <div>
                                <p>{vidDetails?.description}</p>
                            </div>
                        </div>
                        <Video className="video-detail" videos={videos} />
                    </div>

                </div>

            </section>
        </>
    );
};

export default Page;
