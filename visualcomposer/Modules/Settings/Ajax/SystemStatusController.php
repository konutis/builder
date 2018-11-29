<?php

namespace VisualComposer\Modules\Settings\Ajax;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Update;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Status;
use VisualComposer\Helpers\Traits\EventsFilters;

class SystemStatusController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Settings\Ajax\SystemStatusController::checkVersion */
        $this->addFilter(
            'vcv:ajax:checkVersion:adminNonce',
            'checkVersion'
        );

        /** @see \VisualComposer\Modules\Settings\Ajax\SystemStatusController::runAllChecks */
        $this->addFilter(
            'vcv:ajax:checkSystem:adminNonce',
            'checkSystem'
        );

        /** @see \VisualComposer\Modules\Settings\Ajax\SystemStatusController::runAllChecks */
        $this->addFilter(
            'vcv:ajax:checkPayloadProcessing:adminNonce',
            'checkPayloadProcessing'
        );
    }

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Hub\Update $hubUpdateHelper
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed
     * @throws \ReflectionException
     */
    protected function checkVersion($response, Update $hubUpdateHelper, Options $optionsHelper)
    {
        $checkVersion = $hubUpdateHelper->checkVersion();
        $response['status'] = $checkVersion['status'];

        if ($response['status'] === true) {
            $optionsHelper->setTransient('lastBundleUpdate', 1);
        }

        return $response;
    }

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Status $statusHelper
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed
     */
    protected function checkSystem($response, Status $statusHelper, Options $optionsHelper)
    {
        $statusHelper->checkSystemStatusAndSetFlag($optionsHelper);

        return $response;
    }

    /**
     * This check can only be triggered from frontend, as the idea is to pass A LOT OF DATA, and let server handle it
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return mixed
     */
    protected function checkPayloadProcessing($response, $payload, Request $requestHelper)
    {
        $response['status'] = true;
        $checkPayload = $requestHelper->input('vcv-check-payload');
        $checkPayloadDecoded = json_decode($checkPayload, true);

        if ($checkPayloadDecoded['data1']['data2']['data3']['checkNode'] === 'checkMe') {
            return $response;
        }

        $response['status'] = false;

        return $response;
    }
}
