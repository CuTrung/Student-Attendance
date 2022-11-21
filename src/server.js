import express from 'express';
import initRoutes from './config/initRoutes';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import staticFiles from './config/staticFiles';
import allowCORS from './config/allowCORS';
import cookieParser from 'cookie-parser';
import teacherServices from './services/teachers/teacherServices';
const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser())


allowCORS(app);

staticFiles(app);

initRoutes(app);

const run = async () => {
    let data = await teacherServices.getAllTeachers();
}
run();


app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
})
