export default function TextValidators(e) {
    let { name, value } = e.target
    switch (name) {
        case 'name':
        case 'icon':
            if (!value || value.length === 0)
                return name + " Field Is Mendatory"
            else if (value.length < 2 || value.length > 100)
                return name + " Field Length Must Be 2-100 Characters"
            else
                return ""

        case 'registrationNumber':
            if (!value || value.length === 0)
                return name + " Field Is Mendatory"
            else if (value.length < 10 || value.length > 20)
                return name + " Field Length Must Be 10-20 Characters"
            else
                return ""

        case 'baseRentAmount':
            if (!value || value.length === 0)
                return name + " Field Is Mendatory"
            else if (parseInt(value) < 1)
                return "Rent Amount Must Be Greater Then 0"
            else
                return ""

        case 'discount':
            if (!value || value.length === 0)
                return name + " Field Is Mendatory"
            else if (parseInt(value) < 1 || parseInt(value) > 100)
                return "Discount Must Be 1-100"
            else
                return ""

        case 'shortDescription':
        case 'answer':
            if (!value || value.length === 0)
                return name + " Field Is Mendatory"
            else if (value.length < 50)
                return name + " Field Length Must Be 50 Characters or More"
            else
                return ""

        case 'question':
        case 'address':
            if (!value || value.length === 0)
                return name + " Field Is Mendatory"
            else if (value.length < 20)
                return name + " Field Length Must Be 20 Characters or More"
            else
                return ""

        default:
            return ""
    }
}