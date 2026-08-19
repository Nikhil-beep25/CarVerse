const getCollectionName = (collection) => {
    // Map singular collection names from Redux to plural endpoints in Express API
    if (collection === 'category') return 'categories';
    return collection + 's';
};

const getBaseUrl = () => {
    return import.meta.env.VITE_APP_BACKEND_SERVER;
};

const getAuthHeaders = (isMultipart = false) => {
    const token = localStorage.getItem('token');
    const headers = {
        "Authorization": `Bearer ${token}`
    };
    if (!isMultipart) {
        headers["content-type"] = "application/json";
    }
    return headers;
};

//Create Record : used the following code when payload doesn't contain any file field
export async function createRecord(collection, action) {
    try {
        const pluralCollection = getCollectionName(collection);
        let response = await fetch(`${getBaseUrl()}/${pluralCollection}`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ ...action.payload })
        })
        response = await response.json()
        return response.data || response // Return data array if success
    } catch (error) {
        console.log(error)
        return []
    }
}

//Create Record : used the following code when payload contains any file field
export async function createMultipartRecord(collection, action) {
    try {
        const pluralCollection = getCollectionName(collection);
        let response = await fetch(`${getBaseUrl()}/${pluralCollection}`, {
            method: "POST",
            headers: getAuthHeaders(true),
            body: action.payload
        })
        response = await response.json()
        return response.data || response
    } catch (error) {
        console.log(error)
        return []
    }
}

//Get Record
export async function getRecord(collection) {
    try {
        const pluralCollection = getCollectionName(collection);
        let response = await fetch(`${getBaseUrl()}/${pluralCollection}`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        })
        response = await response.json()
        if (response.data) {
            return response.data;
        } else if (Array.isArray(response)) {
            return response;
        }
        return [];
    } catch (error) {
        console.log(error)
        return []
    }
}

//update Record : used the following code when payload doesn't contain any file field
export async function updateRecord(collection, action) {
    try {
        const pluralCollection = getCollectionName(collection);
        // The id might be _id from mongo, but let's check action.payload.id
        const id = action.payload.id || action.payload._id;
        let response = await fetch(`${getBaseUrl()}/${pluralCollection}/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ ...action.payload })
        })
        response = await response.json()
        return response.data || response
    } catch (error) {
        console.log(error)
        return []
    }
}

//update Record : used the following code when payload contains any file field
export async function updateMultipartRecord(collection, action) {
    try {
        const pluralCollection = getCollectionName(collection);
        const id = action.payload.get("id") || action.payload.get("_id");
        let response = await fetch(`${getBaseUrl()}/${pluralCollection}/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(true),
            body: action.payload
        })
        response = await response.json()
        return response.data || response
    } catch (error) {
        console.log(error)
        return []
    }
}


//Delete Record
export async function deleteRecord(collection, action) {
    try {
        const pluralCollection = getCollectionName(collection);
        const id = action.payload.id || action.payload._id;
        let response = await fetch(`${getBaseUrl()}/${pluralCollection}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        })
        response = await response.json()
        return response.data || response
    } catch (error) {
        console.log(error)
        return []
    }
}