import React from 'react';
import { categories } from '../utils/constants';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { CategoryType } from '@/types/Category';
import Link from 'next/link';
import useAuthToken from '@/hooks/useAuthToken';
import logOut from '@/utils/logOut';

const Category: React.FC<CategoryType> = ({ selectedCategory, setSelectedCategory }) => {
    const token = useAuthToken();
    return (
        <section id='category'>
            <div className="my-container">
                <Swiper
                    slidesPerView={12}
                    pagination={{
                        clickable: true,
                    }}
                    breakpoints={{
                        340: {
                            slidesPerView: 4,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 6,
                            spaceBetween: 10,
                        },
                        1024: {
                            slidesPerView: 10,
                            spaceBetween: 20,
                        },
                    }}
                    freeMode={true}
                    className="mySwiper"
                >
                    {categories.map((el, idx) => {
                        if (token){
                            if (el.name=="Log in"){
                                return;
                            }
                        }else{
                            if(el.name=="Log out" || el.name=="Upload" || el.name=="Account"){
                                return;
                            }
                        }
                        return (
                                                
                            <SwiperSlide key={idx}>
                                <button
                                    className={el.name === selectedCategory ? 'active' : ''}
                                    // onClick={() => setSelectedCategory(el.name)}
                                    onClick={() => {
                                        if(el.name=="Log out"){
                                            logOut();
                                        }
                                        window.location.href = el.url;
                                        
                                    }}
                                >{el.name}</button>
                                {/* <Link href={el.url} className={el.name === selectedCategory ? 'active' : ''}
                                >
                                {el.name}
                                </Link> */}
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </section>
    );
};

export default Category;
