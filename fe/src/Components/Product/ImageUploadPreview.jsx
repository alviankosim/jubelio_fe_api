const ImageUploadPreview = ({ files, setFiles }) => {

    function uploadSingleFile(e) {
        setFiles([...files, {url: URL.createObjectURL(e.target.files[0]), file: (e.target.files[0])}]);
    }

    return (
        <div>
            <div className="form-group my-3">
                <input
                    type="file"
                    className="form-control"
                    onChange={uploadSingleFile}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll' }}>
                {files.length > 0 && files.map((file, i) => <img key={i} height="100" style={{ objectFit: 'contain', marginBottom: '10px' }} src={file.url} />)}
            </div>
        </div>
    );
};

export default ImageUploadPreview;