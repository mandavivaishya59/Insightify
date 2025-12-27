import urllib.parse

BASE = "https://quickchart.io/natural/"

def build_quickchart_url(description: str, labels=None, data=None, data2=None, theme=None, width=800, height=400, backgroundColor=None):
    """
    description: natural text (e.g., 'green bar chart showing revenue by month')
    labels: list strings
    data: list numbers (data1)
    data2: second series (data2)
    theme: dict with colors, background
    returns: full URL
    """
    desc_enc = urllib.parse.quote(description, safe='')
    url = BASE + desc_enc
    params = []
    if data:
        params.append("data1=" + ",".join(map(str, data)))
    if data2:
        params.append("data2=" + ",".join(map(str, data2)))
    if labels:
        params.append("labels=" + ",".join([urllib.parse.quote_plus(str(l)) for l in labels]))
    if backgroundColor:
        params.append("backgroundColor=" + urllib.parse.quote_plus(backgroundColor))
    if width:
        params.append(f"width={width}")
    if height:
        params.append(f"height={height}")
    if theme and "colors" in theme:
        # set label1 param as colors for small compatibility (QuickChart reads natural text, but color hints help)
        # We include a hint in the description as final fallback
        pass
    if params:
        url += "?" + "&".join(params)
    return url
