"use client";


import { Button } from "antd";
import { useEffect, useRef, useState } from "react";

export default function ImageInput({
    setImage,
    uploadPercent,
    uploadError,
    initialImage,
}: {
    setImage: (value: File) => void;
    uploadPercent: number;
    uploadError?: string;
    initialImage?: string;
}) {
    const [imgBase64, setImgBase64] = useState<string | ArrayBuffer | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [isInitialImageLoaded, setIsInitialImageLoaded] =
        useState<boolean>(false);
    const addInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isInitialImageLoaded && initialImage) {
            // Load the initial image from URL on the first render
            setImgBase64(initialImage);
            setIsInitialImageLoaded(true);
        }
    }, [initialImage, isInitialImageLoaded]);

    useEffect(() => {
        if (file) {
            setImage(file);
        }
    }, [file, setImage]);

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (
            !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
                selectedFile.type
            )
        ) {
            setError("This format is not supported");
            return;
        }

        if (selectedFile.size > 50 * 1024 * 1024) {
            setError("Please select a file smaller than 50MB");
            return;
        }

        setError("");

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
            setFile(selectedFile);
            setImgBase64(reader.result);
        };
        reader.onerror = () => {
            console.log(reader.error);
        };
    }

    function addInput() {
        addInputRef.current?.click();
    }

    return (
        <div className="w-full">
            <div
                className="h-[4px] bg-primary mb-1 rounded-full"
                style={{ width: `${uploadPercent * 100}%` }}
            ></div>
            <input
                className="hidden"
                onChange={onChange}
                type="file"
                name="file"
                accept=".jpg, .jpeg, .png, .webp"
                ref={addInputRef}
            />
            <div className="flex flex-row gap-1 flex-wrap">
                {imgBase64 && (
                    <div className="w-[100px] h-[100px] relative rounded-md overflow-hidden">
                        <img
                            alt="Upload image"
                            src={imgBase64 as string}
                            className="w-full h-full absolute object-cover"
                        />
                    </div>
                )}
                <Button
                    className="w-[100px] h-[100px] relative rounded-md overflow-hidden flex items-center justify-center"
                    onClick={addInput}
                >
                    Select Image
                </Button>
            </div>
            <div className="mt-1 text-[13px] text-danger">{error}</div>
            <div className="mt-1 text-[13px] text-danger">{uploadError}</div>
        </div>
    );
}
