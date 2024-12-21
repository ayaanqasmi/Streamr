import { VideoCardProps } from '@/types/Video'
import Link from 'next/link'
import React from 'react'

const VideoSingleCard = ({ video}) => {
    return (
        <section className='video-single'>
            <Link href={
                video.id ? `/video/${video.id}` : `/video/cV2gBU6hKfY`
            }>
                <img src={`data:image/png;base64, ${video?.thumbnail}`} alt={video?.title} />
                <div className="content">
                    <p>
                        {video.title || video.description}
                    </p>
                    <span className="title">
                        {video?.title}
                    </span>
                </div>
            </Link>
        </section>
    )
}

export default VideoSingleCard