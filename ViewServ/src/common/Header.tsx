'use client'
import SearchBar from '@/components/SearchBar'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Header: React.FC = () => {

    return (
        <header id='header'>
            <div className="my-container">
                <div className="row">
                    <Link href='/'>
                        <div className="left" style={{fontSize: "3rem",color:"white"}}>
                            Streamr
                            {/* <Image src='/logo.jpeg' width={130} height={65} alt='Youtube' /> */}
                        </div>
                    </Link>
                    <div className="right">
                        <SearchBar />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header