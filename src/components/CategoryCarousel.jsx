import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Construction, Truck, Wrench, HardHat, Factory, Hammer, Paintbrush, Leaf, Home, Scissors } from 'lucide-react';

const categories = [
    { name: "Construction", icon: <Construction className="h-5 w-5" />, color: "bg-primary-100 text-primary-600" },
    { name: "Drivers", icon: <Truck className="h-5 w-5" />, color: "bg-warning-100 text-warning-600" },
    { name: "Mechanics", icon: <Wrench className="h-5 w-5" />, color: "bg-accent-100 text-accent-600" },
    { name: "Electricians", icon: <HardHat className="h-5 w-5" />, color: "bg-success-100 text-success-600" },
    { name: "Manufacturing", icon: <Factory className="h-5 w-5" />, color: "bg-primary-100 text-primary-600" },
    { name: "Carpenters", icon: <Hammer className="h-5 w-5" />, color: "bg-warning-100 text-warning-600" },
    { name: "Painters", icon: <Paintbrush className="h-5 w-5" />, color: "bg-accent-100 text-accent-600" },
    { name: "Landscaping", icon: <Leaf className="h-5 w-5" />, color: "bg-success-100 text-success-600" },
    { name: "Housekeeping", icon: <Home className="h-5 w-5" />, color: "bg-primary-100 text-primary-600" },
    { name: "Barbers", icon: <Scissors className="h-5 w-5" />, color: "bg-warning-100 text-warning-600" }
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/jobs");
    }

    return (
        <div className="bg-gradient-to-b from-white to-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 font-display">Popular Job Categories</h2>
                    <p className="text-gray-600 mt-3 text-lg">Browse jobs by category and find your perfect match</p>
                </div>
                
                <Carousel className="w-full max-w-5xl mx-auto">
                    <CarouselContent>
                        {
                            categories.map((cat, index) => (
                                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 p-1">
                                    <div className="card-hover">
                                        <Button 
                                            onClick={() => searchJobHandler(cat.name)} 
                                            variant="outline" 
                                            className="rounded-xl py-6 h-auto w-full border-gray-100 shadow-soft hover:border-primary-200 transition-all flex flex-col items-center justify-center gap-3"
                                        >
                                            <div className={`p-3 ${cat.color} rounded-full`}>
                                                {cat.icon}
                                            </div>
                                            <span className="font-medium">{cat.name}</span>
                                        </Button>
                                    </div>
                                </CarouselItem>
                            ))
                        }
                    </CarouselContent>
                    <CarouselPrevious className="left-0 border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-primary-50" />
                    <CarouselNext className="right-0 border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-primary-50" />
                </Carousel>
            </div>
        </div>
    )
}

export default CategoryCarousel