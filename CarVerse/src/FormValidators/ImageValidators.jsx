export default function ImageValidators(e) {
    if (e.target.files.length === 1) {
        let pic = e.target.files[0]
        if (!["image/jpg","image/avif", "image/jpeg", "image/png", "image/gif", "image/webp"].includes(pic.type))
            return "Pic is Not Valid, Please Upload an Image of type .jpg,.jpeg,.png,.gif,.webp"
        else if (pic.size > 1048576)
            return "Pic is Too Heavy, Please Upload an Image Upto 1 MB"
        else
            return ""
    }
    else {
        let errorMessage = []
        Array.from(e.target.files).forEach((pic, index) => {
            if (!["image/jpg","image/avif", "image/jpeg", "image/png", "image/gif", "image/webp"].includes(pic.type))
                errorMessage.push(`Pic${index + 1} is Not Valid, Please Upload an Image of type .jpg,.jpeg,.png,.gif,.webp`)
            else if (pic.size > 1048576)
                errorMessage.push(`Pic${index + 1} is Too Heavy, Please Upload an Image Upto 1 MB`)
        })
        return errorMessage.length === 0 ? "" : errorMessage.join("|")
    }
}