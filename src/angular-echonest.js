/**
 * angular-echonest module
 * https://github.com/kraku/angular-echonest
 *
 * Author: Maciej Podsiedlak - http://mpodsiedlak.com
 */

(function() {
  'use strict';

  angular.module('angular-echonest', []).provider('Echonest', function() {
    var apiUrl = 'http://developer.echonest.com/api/v4/';
    var apiKey = '';
    var Artist, Artists, Songs, obj, http, q;

    var query = function(url, data) {
      var deferred = q.defer();

      data.api_key = apiKey;
      data.format = 'jsonp';
      data.callback = 'JSON_CALLBACK';

      http({
        method: 'JSONP',
        url: apiUrl + url,
        params: data
      }).success(function(result) {
        deferred.resolve(result.response);
      });

      return deferred.promise;
    };

    var artistGet = function(name, data) {
      var t = this;
      data = data || {};

      data.id = t.id;

      query('artist/' + name, data).then(function(result) {
        t[name] = result[name];
      });

      return t;
    };

    var getParams = function(params) {
      var data = [];

      if (params instanceof Object) {
        for (var i in params) {
          if (params.hasOwnProperty(i)) {
            data[i] = params[i];
          }
        }
      }

      return data;
    };

    var artistsGet = function(name, data) {
      return query('artist/' + name, data).then(function(result) {
        var artists = [];

        for (var i in result.artists) {
          artists.push(new Artist(result.artists[i]));
        }

        return artists;
      });
    };

    this.setApiKey = function(value) {
      apiKey = value;
    };


    // Artist class
    Artist = function(props) {
      if (props instanceof Object) {
        for (var i in props) {
          if (props.hasOwnProperty(i)) {
            this[i] = props[i];
          }
        }
      }

      return this;
    };

    Artist.prototype = {
      getBiographies: function(data) {
        artistGet.call(this, 'biographies', data);

        return this;
      },
      getBlogs: function(data) {
        artistGet.call(this, 'blogs', data);

        return this;
      },
      getImages: function(data) {
        artistGet.call(this, 'images', data);

        return this;
      },
      getNews: function(data) {
        artistGet.call(this, 'news', data);

        return this;
      },
      getReviews: function(data) {
        artistGet.call(this, 'reviews', data);

        return this;
      },
      getSongs: function(data) {
        artistGet.call(this, 'songs', data);

        return this;
      },
      getFamiliarity: function(data) {
        artistGet.call(this, 'familiarity', data);

        return this;
      },
      getHotnes: function(data) {
        artistGet.call(this, 'hotttnesss', data);

        return this;
      },
      getSimilar: function(data) {
        artistGet.call(this, 'similar', data);

        return this;
      },
      getTerms: function(data) {
        artistGet.call(this, 'terms', data);

        return this;
      },
      getTwitter: function(data) {
        artistGet.call(this, 'twitter', data);

        return this;
      },
      getUrls: function(data) {
        artistGet.call(this, 'urls', data);

        return this;
      }
    };


    // Artists class
    Artists = function() {
      return this;
    };

    Artists.prototype = {

      /*
       * Search artists
       *
       * doc: http://developer.echonest.com/docs/v4/artist.html#search
       */
      search: function(params) {
        var data = getParams(params);

        return artistsGet.call(this, 'search', data);
      },

      /*
       * Get artist
       *
       * doc: http://developer.echonest.com/docs/v4/artist.html#profile
       */
      get: function(data) {
        if (data instanceof Object) {
          return query('artist/profile', data).then(function(data) {
            return new Artist(data.artist);
          });
        }
      },

      /*
       * Return a list of the top hottt artists.
       *
       * doc: http://developer.echonest.com/docs/v4/artist.html#top-hottt
       */
      topHot: function(params) {
        var data = getParams(params);

        return artistsGet.call(this, 'top_hottt', data);
      },

      /*
       * Suggest artists based upon partial names.
       *
       * doc: http://developer.echonest.com/docs/v4/artist.html#suggest-beta
       */
      suggest: function(params) {
        var data = getParams(params);

        return artistsGet.call(this, 'suggest', data);
      },

      /*
       * Extract artist names from text.
       *
       * doc: http://developer.echonest.com/docs/v4/artist.html#extract-beta
       */
      extract: function(params) {
        var data = getParams(params);

        return artistsGet.call(this, 'extract', data);
      }
    };


    // Songs class
    Songs = function() {
      return this;
    };

    Songs.prototype = {

      /*
       * Search for songs given different query types.
       *
       * doc: http://developer.echonest.com/docs/v4/song.html#search
       */
      search: function(params) {
        var data = getParams(params);

        return query('song/search', data).then(function(result) {
          return result.songs;
        });
      },

      /*
       * Get info about songs given a list of ids.
       *
       * doc: http://developer.echonest.com/docs/v4/song.html#profile
       */
      get: function(data) {
        if (data instanceof Object) {
          return query('song/profile', data).then(function(result) {
            return result.songs[0];
          });
        }
      },

      /*
       * Identifies a song given an Echoprint or Echo Nest Musical Fingerprint hash codes.
       *
       * doc: http://developer.echonest.com/docs/v4/song.html#identify
       */
      identify: function(params) {
        var data = getParams(params);

        return query('song/identify', data).then(function(result) {
          return result.songs;
        });
      }
    };


    this.$get = ['$http', '$q', function($http, $q) {
      http = $http;
      q = $q;

      obj = {
        artists: new Artists(),
        songs: new Songs()
      };

      return obj;
    }];
  });
})();
