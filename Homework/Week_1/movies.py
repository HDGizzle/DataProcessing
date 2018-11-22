#!/usr/bin/env python
# Gijs Beerens:
# 10804463:
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
    movies_titles = dom.findAll("h3", {"class":"lister-item-header"})
    #new = movie_info.findAll("h3", {"class":"lister-item-header"})
    titles = ["Title", ]
    for movie in movies_titles:
        title = movie.a.text
        titles.append(title)

    ratings = ["Rating"]
    movies_ratings = dom.findAll("div", {"class":"inline-block ratings-imdb-rating"})
    for rating in movies_ratings:
        ratings.append(rating["data-value"])

    years = ["Year"]
    movies_year = dom.findAll("span", {"class":"lister-item-year text-muted unbold"})
    for year in movies_year:

        year = year.text
        year = int(''.join(filter(str.isdigit, year)))
        years.append(year)

    actors = ["Actors"]
    moviez = dom.findAll("div", {"class":"lister-item-content"})
    for movie in moviez:
        movies_actors = movie.find_all(href=re.compile("adv_li_st"))
        actorz = []
        for actor in movies_actors:
            actorz.append(actor.text)
        actors.append(actorz)

    # actors = []
    # movies_actors = dom.findAll("p", {"class":""})
    # for actor in movies_actors:
    #     if "Stars" in actor:
    #         actors.append(actor)
    #print(actors)

    runtimes = ["Runtime"]
    movies_runtime = dom.findAll("span", {"class":"runtime"})
    for runtime in movies_runtime:
        runtime = runtime.text
        runtime = int(''.join(filter(str.isdigit, runtime)))
        runtimes.append(runtime)

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED MOVIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    return [titles, ratings, years, actors, runtimes] # REPLACE THIS LINE AS WELL IF APPROPRIATE


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    # for i in range(45):
    #     writer.writerow(data)
    titles = movies[0]
    ratings = movies[1]
    years = movies[2]
    actors = movies[3]
    runtimes = movies[4]

    for i in range(51):
        writer.writerow((titles[i], ratings[i], years[i], actors[i], runtimes[i]))

        # for elements in data:
        #     writer.writerow(elements)
    # writer.writerows(movies[0])
    # writer.writerows(movies[1])
    # writer.writerows(movies[2])
    # writer.writerows(movies[3])

    # writer.writerows(movies[0])
    # writer.writerows(movies[1])

    #['Rating'], ['Year'], ['Actors'], ['Runtime']])
    #writer.writerow(titles)
    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE MOVIES TO DISK


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)
    #print(len(movie_info))

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
