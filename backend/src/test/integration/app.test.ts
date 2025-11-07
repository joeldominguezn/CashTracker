import request from "supertest"
import server, {ConnectDB} from "../../server"

describe("Auth - Register User", () => {
    beforeAll(async () => {
        await ConnectDB()
    })
    it("should throw error from empty 3 erorrs", async () => {
        const res = await request(server)
                                .post("/api/auth/create-account")
                                .send({})
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("errors")
        expect(res.body.errors).toHaveLength(3)
    })
    it("should throw error from email", async () => {
        const userData = {
            name: "joel",
            email: "",
            password: "12345678"
        }
        const res = await request(server)
            .post("/api/auth/create-account")
            .send(userData)
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("errors")
        expect(res.body.errors).toHaveLength(1)
    })
    it("should create a user",async () => {
        const userData = {
            name: "joel",
            email: "joeldomin06@gmail.com",
            password: "12345678"
        }
        const res = await request(server)
            .post("/api/auth/create-account")
            .send(userData)
        expect(res.status).toBe(201)
    })
    it("should throw an error from dupe", async () => {
        const userData = {
            name: "joel",
            email: "joeldomin06@gmail.com",
            password: "12345678"
        }
        const res = await request(server)
        .post("/api/auth/create-account")
        .send(userData)
        expect(res.status).toBe(409)
    })
})