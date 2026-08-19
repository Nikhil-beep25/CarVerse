import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AdminSidebar from "../../../Components/Admin/AdminSidebar";

import ImageValidators from "../../../FormValidators/ImageValidators";
import TextValidators from "../../../FormValidators/TextValidators";

import {
  getCategory,
  updateCategory,
} from "../../../Redux/ActionCreators/CategoryActionCreators";
export default function AdminUpdateCategoryPage() {
  let { id } = useParams();

  let [data, setData] = useState({
    name: "",
    pic: "",
    status: true,
  });
  let [errorMessage, setErrorMessage] = useState({
    name: "",
    pic: "",
  });
  let [show, setShow] = useState(false);

  let CategoryStateData = useSelector((state) => state.CategoryStateData);
  let dispatch = useDispatch();

  let navigate = useNavigate();

  function getInputData(e) {
    let name = e.target.name;
    let value =
      name === "pic" ? "category/" + e.target.files[0].name : e.target.value;
    // let value = name === "pic" ? e.target.files[0] : e.target.value

    setData({
      ...data,
      [name]: name === "status" ? (value === "1" ? true : false) : value,
    });
    setErrorMessage({
      ...errorMessage,
      [name]: name === "pic" ? ImageValidators(e) : TextValidators(e),
    });
  }
  function postData(e) {
    e.preventDefault();
    let error = Object.values(errorMessage).find((x) => x !== "");
    if (error) setShow(true);
    else {
      let item = CategoryStateData.find(
        (x) =>
          x.id !== id &&
          x.name?.toLocaleLowerCase() === data.name?.toLocaleLowerCase(),
      );
      if (item) {
        setShow(true);
        setErrorMessage({
          ...errorMessage,
          name: "Category With This Name Already Exist",
        });
        return;
      }

      dispatch(updateCategory({ ...data }));

      // let formData = new FormData()
      // formData.append("name",data.name)
      // formData.append("pic",data.pic)
      // formData.append("status",data.status)
      // dispatch(updateCategory(formData))

      navigate("/admin/category");
    }
  }

  useEffect(() => {
    dispatch(getCategory());
    if (CategoryStateData.length) {
      let item = CategoryStateData.find((x) => x.id === id);
      if (item) setData({ ...data, ...item });
      else navigate("/admin/category");
    }
  }, [CategoryStateData.length]);
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminSidebar />
          </div>
          <div className="col-md-9">
            <h5 className="bg-primary text-light text-center p-2">
              Update Category
              <Link to="/admin/category">
                <i className="bi bi-arrow-left text-light float-end"></i>
              </Link>
            </h5>
            <form onSubmit={postData}>
              <div className="row">
                <div className="col-12 mb-3">
                  <label>Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={getInputData}
                    placeholder="Category Name"
                    className={`form-control ${show && errorMessage.name ? "border-danger" : "border-dark"}`}
                  />
                  {show && errorMessage.name ? (
                    <p className="text-danger text-capitalize">
                      {errorMessage.name}
                    </p>
                  ) : null}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Pic</label>
                  <input
                    type="file"
                    name="pic"
                    onChange={getInputData}
                    className={`form-control ${show && errorMessage.pic ? "border-danger" : "border-dark"}`}
                  />
                  {show && errorMessage.pic ? (
                    <p className="text-danger text-capitalize">
                      {errorMessage.pic}
                    </p>
                  ) : null}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Status*</label>
                  <select
                    name="status"
                    value={data.status ? "1" : "0"}
                    className="form-select border-dark"
                    onChange={getInputData}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

                <div className="col-12 mb-3">
                  <button type="submit" className="btn btn-primary w-100">
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
