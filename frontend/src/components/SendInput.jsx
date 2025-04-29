import React, {useState, useRef } from 'react'
import { IoSend, IoAttach } from "react-icons/io5";
import axios from "axios";
import {useDispatch,useSelector} from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';

const SendInput = () => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store=>store.user);
    const {messages} = useSelector(store=>store.message);
    const {socket} = useSelector(store=>store.socket);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        
        setIsUploading(true);
        setError("");
        setUploadProgress(0);

        try {
            if (!socket) {
                setError("Socket connection not established. Please refresh the page.");
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            if (message.trim()) {
                formData.append('message', message);
            }

            const res = await axios.post(
                `${BASE_URL}/api/v1/message/send/${selectedUser?._id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true,
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                }
            );

            if (res?.data?.newMessage) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setMessage("");
                setError("");
            } else {
                setError("Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setError(error.response?.data?.message || "Failed to send message. Please try again.");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        
        try {
            if (!socket) {
                setError("Socket connection not established. Please refresh the page.");
                return;
            }

            const res = await axios.post(
                `${BASE_URL}/api/v1/message/send/${selectedUser?._id}`,
                { message },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (res?.data?.newMessage) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setMessage("");
                setError("");
            } else {
                setError("Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setError(error.response?.data?.message || "Failed to send message. Please try again.");
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='px-4 my-3'>
            <div className='w-full relative'>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    placeholder='Send a message...'
                    className='border text-sm rounded-lg block w-full p-3 border-zinc-500 bg-gray-600 text-white'
                    disabled={isUploading}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
                        className="hidden"
                        disabled={isUploading}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Attach file"
                        disabled={isUploading}
                    >
                        <IoAttach size={20} />
                    </button>
                    <button
                        type="submit"
                        className="text-green-200 hover:text-green-500 transition-colors"
                        disabled={isUploading}
                    >
                        <IoSend size={20} />
                    </button>
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {isUploading && (
                <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">Uploading: {uploadProgress}%</p>
                </div>
            )}
        </form>
    );
};

export default SendInput;