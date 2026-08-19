import Breadcrum from '../Components/Breadcrum'
import Service from '../Components/Service'
import Stats from '../Components/Stats'
import Banner from '../Components/Banner'
import Testimonial from '../Components/Testimonial'

export default function ServicePage() {
    return (
        <>
            <Breadcrum title="Service" />
            <Service />
            <Stats />
            <Testimonial />
            <Banner />
        </>
    )
}