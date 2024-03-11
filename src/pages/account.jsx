import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import Button from "../components/button";
import Profile from "../components/profile";
import { Link } from "react-router-dom";
import { storage } from "../firebase";
import { onAuthStateChanged, updatePassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Modal from "../components/modal";
import profile from "../components/profile";
import InputForm from "../components/inputForm";

function account() {
  const [loading, setLoading] = useState(true);
  const [profilePicURL, setProfilePicURL] = useState("");
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState('');
  const [user, setUser] = useState(null);
  const [provider, setProvider] = useState('');

  const inputFile = useRef(null);

  function updateNewPassword(e){
    e.preventDefault();
    if (newPassword.length < 8) {document.getElementById("error_modal").showModal();}
    else {
      updatePassword(user, newPassword)
    logOut();};
  }

  function updateUsername(e){
    e.preventDefault();
    updateProfile(user, {
      displayName: newUsername
    })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(true);
        document.getElementById("not_signed_in").showModal();
      } else {
        setLoading(false);
        setProfilePicURL(user.photoURL || "");
        setNewUsername(user.displayName)
        setUser(user)
      }
    });

    return () => unsubscribe();
  }, []);

  const uploadImageToStorage = async () => {
    try {
      const storageRef = ref(storage, "profilePics/" + auth.currentUser.uid);
      const file = inputFile.current.files[0];

      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        document.getElementById("invalid_file_types").showModal();
        throw new Error("Invalid file type. Please choose a PNG or JPEG file.");
      }

      if (!file) {
        return 'https://gravatar.com/avatar/f368a4bdd2ae828746de4d5dd08702b0?s=400&d=mp&r=x';
      }

      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error uploading image to storage:", error);
      throw error;
    }
  };

  const updateProfilePic = async () => {
    try {
      const photoURL = await uploadImageToStorage();

      await updateProfile(auth.currentUser, {
        photoURL,
      });

      setProfilePicURL(photoURL); // Update the state with the new profile picture URL
    } catch (e) {
      console.error("Error updating profile picture:", e);
    }
  };

  function showProfilePicModal(e) {
    e.preventDefault();
    document.getElementById("changeProfPic").showModal();
  }

  function logOut() {
    auth.signOut();
    window.location.href = "/";
  }

  return <>
    <div className="flex flex-col w-screen h-screen p-4">
      <div className="my-4 mx-2 align-middle gap-2 flex flex-row items-center">
        <Link to="/todo">
          <button className="btn"><IoIosArrowBack className="text-4xl" /></button>
        </Link>
        <span className="text-2xl font-bold">Settings</span>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      </div>
      <div className="flex justify-center items-center flex-row gap-4">
        <div className="">
          {loading ? (<Profile />) : (<Profile email={auth.currentUser.email} username={auth.currentUser.displayName} profpic={profilePicURL} />)}
        </div>
        <div className="flex flex-col gap-2">
          <Button handleSubmit={showProfilePicModal} value={"Edit Profile Picture"} />
          <button className="btn btn-error" onClick={logOut}>Sign Out</button>
        </div>
      </div>
      <dialog id="changeProfPic" className="modal">
        <div className="modal-box">
          <div className='flex flex-row m-2'>
            <div className='flex flex-col gap-2 mx-2'>
              <h3 className="font-bold text-lg">Change Profile Picture</h3>
              <input type='file' id='file' ref={inputFile} />
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-primary" onClick={updateProfilePic}>Confirm</button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      {loading ? (<></>) : (<div className="flex justify-center items-center p-4">
        <form className="flex flex-col gap-4">
          <h1 className="font-bold text-2xl">Change Password</h1>

          <div className="flex flex-row items-end gap-2">
            
            <div className="flex flex-row gap-2 items-end justify-between">
              <InputForm
                type="password"
                value={newPassword}
                label="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={(e)=>updateNewPassword(e)}>Change</button>
          </div>
        </form>
      </div>)}
    </div>
    <Modal id={"not_signed_in"} title={"Error"} desc={"You have not logged in yet."} onClick={logOut} />
    <Modal id={"invalid_file_types"} title={"Error"} desc={"Invalid File types. The file should be in .png, .jpg or .gif"} />
    <Modal id ={"error_modal"} title={"Error"} desc={"Password must be more than 8 characters."} />
  </>
}

export default account;
