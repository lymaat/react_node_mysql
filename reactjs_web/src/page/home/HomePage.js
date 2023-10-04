import {useState} from "react";
import "./HomePage.css"
import CarouselHome from "../../component/Carousel/CarouselHome";
import HomeHotItem from "./HomeHotItem";


function HomePage (){

    return (
        <div>
            <CarouselHome />
            <HomeHotItem />
        </div>
    )
}

export default HomePage