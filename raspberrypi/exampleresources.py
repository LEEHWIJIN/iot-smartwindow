import time
import string
import random
import datetime
from coapthon import defines

from coapthon.resources.resource import Resource
import sys
import RPi.GPIO as gpio
import base64


control_pins1 = [12,16,20,21]
control_pins2 = [6,13,19,26]
gpio.setmode(gpio.BCM)

for pin1 in control_pins1:
    gpio.setup(pin1, gpio.OUT)    
for pin2 in control_pins2:
    gpio.setup(pin2, gpio.OUT)

__author__ = 'Giacomo Tanganelli'

global sumw
sumw=0
global sumb
sumb=0
step_seq1 = [
[1,0,0,0],
[1,1,0,0],
[0,1,0,0],
[0,1,1,0],
[0,0,1,0],
[0,0,1,1],
[0,0,0,1],
[1,0,0,1]
]
step_seq2 = [
[1,0,0,1],
[0,0,0,1],
[0,0,1,1],
[0,0,1,0],
[0,1,1,0],
[0,1,0,0],
[1,1,0,0],
[1,0,0,0],
[1,0,0,1]
]
class BasicResource(Resource):
    def __init__(self, name="BasicResource", coap_server=None):
        super(BasicResource, self).__init__(name, coap_server, visible=True,
                                            observable=True, allow_children=True)
        self.payload = "Basic Resource"
        self.resource_type = "rt1"
        self.content_type = "text/plain"
        self.interface_type = "if1"

    def render_GET(self, request):
        return self

    def render_PUT(self, request):
        self.edit_resource(request)
        return self

    def render_POST(self, request):
        res = self.init_resource(request, BasicResource())
        return res

    def render_DELETE(self, request):
        return True


class Storage(Resource):
    def __init__(self, name="StorageResource", coap_server=None):
        super(Storage, self).__init__(name, coap_server, visible=True, observable=True, allow_children=True)
        self.payload = "Storage Resource for PUT, POST and DELETE"

    def render_GET(self, request):
        return self

    def render_POST(self, request):
        res = self.init_resource(request, BasicResource())
        return res


class Child(Resource):
    def __init__(self, name="ChildResource", coap_server=None):
        super(Child, self).__init__(name, coap_server, visible=True, observable=True, allow_children=True)
        self.payload = ""

    def render_GET(self, request):
        return self

    def render_PUT(self, request):
        self.payload = request.payload
        return self

    def render_POST(self, request):
        res = BasicResource()
        res.location_query = request.uri_query
        res.payload = request.payload
        return res

    def render_DELETE(self, request):
        return True


class Separate(Resource):

    def __init__(self, name="Separate", coap_server=None):
        super(Separate, self).__init__(name, coap_server, visible=True, observable=True, allow_children=True)
        self.payload = "Separate"
        self.max_age = 60

    def render_GET(self, request):
        return self, self.render_GET_separate

    def render_GET_separate(self, request):
        time.sleep(5)
        return self

    def render_POST(self, request):
        return self, self.render_POST_separate

    def render_POST_separate(self, request):
        self.payload = request.payload
        return self

    def render_PUT(self, request):
        return self, self.render_PUT_separate

    def render_PUT_separate(self, request):
        self.payload = request.payload
        return self

    def render_DELETE(self, request):
        return self, self.render_DELETE_separate

    def render_DELETE_separate(self, request):
        return True


class Long(Resource):

    def __init__(self, name="Long", coap_server=None):
        super(Long, self).__init__(name, coap_server, visible=True, observable=True, allow_children=True)
        self.payload = "Long Time"

    def render_GET(self, request):
        time.sleep(10)
        return self


class Big(Resource):

    def __init__(self, name="Big", coap_server=None):
        super(Big, self).__init__(name, coap_server, visible=True, observable=True, allow_children=True)
        self.payload = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sollicitudin fermentum ornare. " \
                       "Cras accumsan tellus quis dui lacinia eleifend. Proin ultrices rutrum orci vitae luctus. " \
                       "Nullam malesuada pretium elit, at aliquam odio vehicula in. Etiam nec maximus elit. " \
                       "Etiam at erat ac ex ornare feugiat. Curabitur sed malesuada orci, id aliquet nunc. Phasellus " \
                       "nec leo luctus, blandit lorem sit amet, interdum metus. Duis efficitur volutpat magna, ac " \
                       "ultricies nibh aliquet sit amet. Etiam tempor egestas augue in hendrerit. Nunc eget augue " \
                       "ultricies, dignissim lacus et, vulputate dolor. Nulla eros odio, fringilla vel massa ut, " \
                       "facilisis cursus quam. Fusce faucibus lobortis congue. Fusce consectetur porta neque, id " \
                       "sollicitudin velit maximus eu. Sed pharetra leo quam, vel finibus turpis cursus ac. " \
                       "Aenean ac nisi massa. Cras commodo arcu nec ante tristique ullamcorper. Quisque eu hendrerit" \
                       " urna. Cras fringilla eros ut nunc maximus, non porta nisl mollis. Aliquam in rutrum massa." \
                       " Praesent tristique turpis dui, at ultricies lorem fermentum at. Vivamus sit amet ornare neque, " \
                       "a imperdiet nisl. Quisque a iaculis libero, id tempus lacus. Aenean convallis est non justo " \
                       "consectetur, a hendrerit enim consequat. In accumsan ante a egestas luctus. Etiam quis neque " \
                       "nec eros vestibulum faucibus. Nunc viverra ipsum lectus, vel scelerisque dui dictum a. Ut orci " \
                       "enim, ultrices a ultrices nec, pharetra in quam. Donec accumsan sit amet eros eget fermentum." \
                       "Vivamus ut odio ac odio malesuada accumsan. Aenean vehicula diam at tempus ornare. Phasellus " \
                       "dictum mauris a mi consequat, vitae mattis nulla fringilla. Ut laoreet tellus in nisl efficitur," \
                       " a luctus justo tempus. Fusce finibus libero eget velit finibus iaculis. Morbi rhoncus purus " \
                       "vel vestibulum ullamcorper. Sed ac metus in urna fermentum feugiat. Nulla nunc diam, sodales " \
                       "aliquam mi id, varius porta nisl. Praesent vel nibh ac turpis rutrum laoreet at non odio. " \
                       "Phasellus ut posuere mi. Suspendisse malesuada velit nec mauris convallis porta. Vivamus " \
                       "sed ultrices sapien, at cras amet."

    def render_GET(self, request):
        return self

    def render_POST(self, request):
        if request.payload is not None:
            self.payload = request.payload
        return self


class voidResource(Resource):
    def __init__(self, name="Void"):
        super(voidResource, self).__init__(name)


class XMLResource(Resource):
    def __init__(self, name="XML"):
        super(XMLResource, self).__init__(name)
        self.value = 0
        self.payload = (defines.Content_types["application/xml"], "<value>"+str(self.value)+"</value>")

    def render_GET(self, request):
        return self


class MultipleEncodingResource(Resource):
    def __init__(self, name="MultipleEncoding"):
        super(MultipleEncodingResource, self).__init__(name)
        self.value = 0
        self.payload = str(self.value)
        self.content_type = [defines.Content_types["application/xml"], defines.Content_types["application/json"]]

    def render_GET(self, request):
        if request.accept == defines.Content_types["application/xml"]:
            self.payload = (defines.Content_types["application/xml"],  "<value>"+str(self.value)+"</value>")
        elif request.accept == defines.Content_types["application/json"]:
            self.payload = (defines.Content_types["application/json"], "{'value': '"+str(self.value)+"'}")
        elif request.accept == defines.Content_types["text/plain"]:
            self.payload = (defines.Content_types["text/plain"], str(self.value))
        return self

    def render_PUT(self, request):
        self.edit_resource(request)
        return self

    def render_POST(self, request):
        res = self.init_resource(request, MultipleEncodingResource())
        return res


class ETAGResource(Resource):
    def __init__(self, name="ETag"):
        super(ETAGResource, self).__init__(name)
        self.count = 0
        self.payload = "ETag resource"
        self.etag = str(self.count)

    def render_GET(self, request):
        return self

    def render_POST(self, request):
        self.payload = request.payload
        self.count += 1
        self.etag = str(self.count)
        return self

    def render_PUT(self, request):
        self.payload = request.payload
        return self


class AdvancedResource(Resource):
    def __init__(self, name="Advanced"):
        super(AdvancedResource, self).__init__(name)
        self.payload = "Advanced resource"

    def render_GET_advanced(self, request, response):
        
        response.payload = self.payload
        response.max_age = 20
        response.code = defines.Codes.CONTENT.number
        return self, response

    def render_POST_advanced(self, request, response):
        self.payload = request.payload
        from coapthon.messages.response import Response
        assert(isinstance(response, Response))
        data=request.payload
        fh = open("imageToSave.jpg", "wb")
        fh.write(data.decode('base64'))
        fh.close()
        response.payload = "Response changed through POST"
        response.code = defines.Codes.CREATED.number
        return self, response

    def render_PUT_advanced(self, request, response):
        
        global sumw
        global sumb
        print request.payload
        self.payload = request.payload
        from coapthon.messages.response import Response
        print(request.payload[1])
        assert(isinstance(response, Response))
        print(request.payload[1])
        data2=request.payload.strip('"')
        data1=data2.split()
        print(request.payload[1])
        if data1[0]=='w':
            q=int(data1[1])
            print(q)
            q*=250
            if q<sumw:
                for i in range(2000):
                    for half in range(8):
                        for pin in range(4):
                            sumw-=1
                            gpio.output(control_pins2[pin], step_seq2[half][pin])
                            if q==sumw:
                                break
                        time.sleep(0.001)
                        if q == sumw:
                            break
                    if q==sumw:
                        break
            elif q>sumw:
                for i in range(2000):
                    for half in range(8):
                        for pin in range(4):
                            sumw+=1
                            gpio.output(control_pins2[pin], step_seq1[half][pin])
                            if q==sumw:
                                break
                        time.sleep(0.001)
                        if q==sumw:
                            break
                    if q==sumw:
                        break
            sumw=q
            response.payload = "w " + str(sumw)
        elif data1[0]=='b':
            q=int(data1[1])
            q*=300
            print(q)
            print(sumb)
            if q<sumb:
                for i in range(20000):
                    for half in range(8):
                        for pin in range(4):
                            sumb-=1
                            gpio.output(control_pins1[pin], step_seq2[half][pin])
                            if q==sumb:
                                break
                        time.sleep(0.001)
                        if q==sumb:
                            break
                    if q==sumb:
                        break
            elif q>sumb:
                for i in range(20000):
                    for half in range(8):
                        for pin in range(4):
                            sumb+=1
                            gpio.output(control_pins1[pin], step_seq1[half][pin])
                            if q==sumb:
                                break
                        time.sleep(0.001)
                        if q==sumb:
                            break
                    if q==sumb:
                        break
            sumb=q
            response.payload = "b " + str(sumb)
        elif request.payload[1]=='f':
            response.payload = "f "+ str(now())+" "+ str(random.randrange(1,7))
        
        response.code = defines.Codes.CHANGED.number
        return self, response

    def render_DELETE_advanced(self, request, response):
        response.payload = "Response deleted"
        response.code = defines.Codes.DELETED.number
        return True, response


class AdvancedResourceSeparate(Resource):
    def __init__(self, name="Advanced"):
        super(AdvancedResourceSeparate, self).__init__(name)
        self.payload = "Advanced resource"

    def render_GET_advanced(self, request, response):
        return self, response, self.render_GET_separate

    def render_POST_advanced(self, request, response):
        return self, response, self.render_POST_separate

    def render_PUT_advanced(self, request, response):

        return self, response, self.render_PUT_separate

    def render_DELETE_advanced(self, request, response):
        return self, response, self.render_DELETE_separate

    def render_GET_separate(self, request, response):
        time.sleep(5)
        response.payload = self.payload
        response.max_age = 20
        return self, response

    def render_POST_separate(self, request, response):
        self.payload = request.payload
        response.payload = "Response changed through POST"
        return self, response

    def render_PUT_separate(self, request, response):
        self.payload = request.payload
        response.payload = "Response changed through PUT"
        return self, response

    def render_DELETE_separate(self, request, response):
        response.payload = "Response deleted"
        return True, response

