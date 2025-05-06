import React from 'react'
import CarouselBox from '../components/CarouselBox';
import AccordionBox from '../components/AccordionBox';
import BannerBox from '../components/BannerBox';
import CardBox from '../components/CardBox';
import Services from '../components/Services';
import TestimonialsSlider from '../components/TestimonialsSlider';
import RegistrationForm from '../components/RegistrationForm';
import AboutGalleryBlock from '../components/AboutGalleryBlock';

export default function Home() {
  return (
    <>
      <CarouselBox/>
      <BannerBox/>
      <AboutGalleryBlock/>
      <Services/>
      <TestimonialsSlider/>
      <RegistrationForm/>
      <AccordionBox/>
      <CardBox/>
    </>
  )
}

