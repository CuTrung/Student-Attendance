// Tạo form theo props truyền vào, mục đích để rút gọn code, sau này sẽ bổ sung
const GenerateForm = (props) => {
    const id = props.id;
    // fullName: [input, onChange, value]
    const [field, [type, e, value]] = props.data;

}

export default GenerateForm;