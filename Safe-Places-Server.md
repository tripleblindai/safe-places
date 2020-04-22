# Safe Places Server

Safe Places can be hosted by a server which implements five basic endpoints.
The [Redaction Tool](location_scrubber/index.html) and the [Publisher](publisher/index.html) support being served by such a server.  They can be simply modified by changing the value of `has_backend` within the Javascript, then serving them to a browser.  These webapps will automatically operate with the backend which implements this API.

Anyone who implements this API this is should be aware of [healthcare-authorities.yaml](./healthcare-authorities.yaml).  The output of the safe-paths.json endpoint outputs exactly the format expected by a Safe Places client and can be added to that Healthcare Authority registry.

API Endpoints
=======

* [Login](#login)
* [Save redacted](#save-redacted)
* [Load all redacted](#load-all-redacted)
* [Publish](#publish)
* [safe-paths.json](#safe-paths.json)


## Login

This is the beginning of a user interaction with the tool page.  They must be authenticated, but
the authentication will be saved using a cookie for future sessions.

Credentials will be controlled and issued by the server implementor.

<table>
<tr><td>URL:</td>                    <td>/login</td></tr>
<tr><td>METHOD:</td>                 <td>POST</td></tr>
<tr><td  valign="top">PAYLOAD:</td>  <td>JSON

```json
{
    "username": "<username>",
    "password": "<password>"
}
```
</td></tr>
<tr><td  valign="top">RESPONSE:</td>  <td>JSON

```json
{
    "token": "<session_token>",
    "maps_api_key": "<maps_api_key>"
}
```

The maps_api_key is a [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/get-api-key) key.
</td></tr>
</table>



## Save Redacted

After a session of redaction, the results are saved to a database/table.

<table>
<tr><td>URL:</td>                    <td>/redacted_trail/</td></tr>
<tr><td>METHOD:</td>                 <td>POST</td></tr>
<tr><td  valign="top">PAYLOAD:</td>  <td>JSON

```json
{
    "identifier":<some random identifier created by user>,
    "trail":[
        { "time": 123456789, "latitude": 12.34, "longitude": 12.34}
    ]
}
```
</td></tr>
<tr><td  valign="top">RESPONSE:</td>  <td>JSON

```json
{
  "data": {
    "identifier": "<identifier>",
    "organization_id": "<organization_id>",
    "trail": [
        { "time": 123456789, "latitude": 12.34, "longitude": 12.34}
    ],
    "user_id": "<user_id>"
  },
  "success": true
}
```
</td></tr>
</table>



## Load All Redacted

Used by the publisher tool, all redaction data is loaded.

<table>
<tr><td>URL:</td>                    <td>/redacted_trails/</td></tr>
<tr><td>METHOD:</td>                 <td>GET</td></tr>
<tr><td  valign="top">PAYLOAD:</td>  <td>empty

</td></tr>
<tr><td  valign="top">RESPONSE:</td>  <td>JSON

```json
{
  "data": [
    {
      "identifier": <identifier>,
      "organization_id": <organization_id>,
      "trail": [
        { "time": 123456789, "latitude": 12.34, "longitude": 12.34}
      ],
      "user_id": <user_id>
    },
    {
      "identifier": <identifier>,
      "organization_id": <organization_id>,
      "trail": [{
        { "time": 123456789, "latitude": 12.34, "longitude": 12.34}
      ],
      "user_id": <user_id>
    }
  ]
}
```
</td></tr>
</table>



## Publish

Used by the Publisher tool, all points are published along with extra information.

<table>
<tr><td>URL:</td>                    <td>/safe_paths/</td></tr>
<tr><td>METHOD:</td>                 <td>POST</td></tr>
<tr><td  valign="top">PAYLOAD:</td>  <td>JSON

```json
{ "authority_name":  "Steve's Fake Testing Organization",
  "publish_date_utc": "1584924583",
  "info_website": "https://www.who.int/emergencies/diseases/novel-coronavirus-2019",
  "concern_points":
   [
     { "time": 123, "latitude": 12.34, "longitude": 12.34},
     { "time": 456, "latitude": 12.34, "longitude": 12.34}
   ]
}
```
</td></tr>
<tr><td  valign="top">RESPONSE:</td>  <td>JSON

```json
{
  "datetime_created": "Fri, 27 Mar 2020 04:32:12 GMT",
  "organization_id": <organization_id>,
  "safe_path": {
    "authority_name": "Fake Organization",
    "concern_points": [
      {
        "latitude": 12.34,
        "longitude": 12.34,
        "time": 123
      },
      {
        "latitude": 12.34,
        "longitude": 12.34,
        "time": 456
      }
    ],
    "info_website": "https://www.something.gov/path/to/info/website",
    "publish_date_utc": 1584924583
  },
  "user_id": <user_id>
}
```
</td></tr>
</table>




## safe-paths.json

Consumed by the Safe Paths client application.  This requires no authentication.

<table>
<tr><td>URL:</td>                    <td>/safe_path/&lt;organization_id&gt/</td></tr>
<tr><td>METHOD:</td>                 <td>GET</td></tr>
<tr><td  valign="top">PAYLOAD:</td>  <td>empty
</td></tr>
<tr><td  valign="top">RESPONSE:</td>  <td>JSON

```json
{
    "authority_name": "Fake Organization",
    "concern_points": [
      {
        "latitude": 12.34,
        "longitude": 12.34,
        "time": 1584924233
      },
      {
        "latitude": 12.34,
        "longitude": 12.34,
        "time": 1584924583
      }
    ],
    "info_website": "https://www.something.gov/path/to/info/website",
    "publish_date_utc": "1584924583"
}
```
</td></tr>
</table>


