import React, { useEffect, useState, useContext } from 'react';
import Notiflix from 'notiflix';
import { useForm } from 'react-hook-form';
import { profileUpload } from '../../services/profile.service';
export default function profilePicture(props) {
    const [drugs, setDrugs] = useState([]);
    const [sText, setText] = useState(null);
    const [file, setFile] = useState(null);
    const [defaultImage, setDefault] = useState(null);

    useEffect(() => {
        setDefault(props.default)
    }, [props.default]);


    const handleFileChange = () => (e) => {
        setFile(e.target.files[0]);
        uploadProfile(e.target.files[0])
    };

    const uploadProfile = async (file) => {

        const form = new FormData();
        form.append('category', 'profile');
        form.append('file', file);
        Notiflix.Loading.pulse('Loading...');
        try {
            const response = await profileUpload(form);
            if (response.data && response.data.msg) {
                Notiflix.Notify.success(response.data.msg);
            } else {
                Notiflix.Notify.warning(response.data.error || 'Failed to Complete');
            }
        } catch (e) {
            console.log(e);
            Notiflix.Notify.failure(e.response.data.message);
        } finally {
            Notiflix.Loading.remove();
        }
    };


    return (
        <form method="post">
            <div>
                <label htmlFor="upload-button">
                    {defaultImage ? (
                        <img src={defaultImage} alt="dummy" width="150" />
                    ) : (
                        <>
                            <span className="fa-stack fa-2x mt-3 mb-2">
                                <i className="fas fa-circle fa-stack-2x" />
                                <i className="fas fa-store fa-stack-1x fa-inverse" />
                            </span>
                            <h5 className="text-center">Click the image to edit</h5>
                        </>
                    )}
                </label>
                <input
                    type="file" name="file"
                    id="upload-button"
                    style={{ display: "none" }}
                    onChange={handleFileChange()}
                />
                <br />
            </div>
            <div className="form-group mt-3">
                <label className="mr-2 ">
                    Click the image to edit
                </label><br />
                {/* <div class="upload-btn-wrapper">
                    <button class="cbtn">Select an image</button>
                    <input type="file" name="file"
                        onChange={handleFileChange()} />
                </div> */}

            </div>
        </form>

    );
}
