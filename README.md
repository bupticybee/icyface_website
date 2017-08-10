# icyface_website
This is the code of web interface of icyface, a face recognization platform. The website is build entirely with django, a python web framework. Database is not required for this application.

You deploy this project through standard django application deployment process(nginx + uwsgi suggested). Or 

```
python manage.py runserver
```
if you meant to test the project

However, this project only includes the website of icyface, icyface api should also be deployed to make the website fully functional.
