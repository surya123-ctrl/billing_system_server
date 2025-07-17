from locust import HttpUser, between, task

class WebsiteUser(HttpUser):

    def on_start(self):
        # Set your token and headers here
        self.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOiIyMDI1LTA3LTE2VDExOjUzOjQyLjU4NVoiLCJleHAiOjE3NTI2NzA0MjIsImlhdCI6MTc1MjY2NjgyMn0.DFLhHE_XL9IVbMB9_jE_U4vwQsO5IemruqU70_vKWT8"
        self.headers = {
            "Authorization": self.token,
            "Content-Type": "application/json"
        }

    @task
    def get_menu(self):
        self.client.get(
            "/customer/menu/68774dc6ef848a494f781b49?itemState=active",
            headers=self.headers
        )
